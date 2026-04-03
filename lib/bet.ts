import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN, Idl } from "@project-serum/anchor";
import { IDL, BETTING_PROGRAM_ID, ADMIN_WALLET_ADDRESS, ADMIN_WALLET_KEYPAIR } from "../constant/system";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

export const getBettingProgram = (connection: Connection) => {
    let cloneWindow: any = window;
    const provider = new AnchorProvider(connection, cloneWindow['solana'], {
        commitment: "confirmed",
    });
    return new Program(IDL as unknown as Idl, BETTING_PROGRAM_ID, provider);
};

export const getBettingProgramWithAdminWallet = () => {
    const authority = Keypair.fromSecretKey(
        new Uint8Array(ADMIN_WALLET_KEYPAIR)
    );
    const wallet = {
        payer: authority,
        publicKey: authority.publicKey,
        signTransaction: async (tx: any) => {
            tx.partialSign(authority);
            return tx;
        },
        signAllTransactions: async (txs: any[]) => {
            return txs.map((tx) => {
                tx.partialSign(authority);
                return tx;
            });
        },
    };
    const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });
    return new Program(IDL as unknown as Idl, BETTING_PROGRAM_ID, provider);
};

export const getStakerPDA = (wallet: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("staker"), wallet.toBuffer()],
        BETTING_PROGRAM_ID
    );
};

export const getVaultPDA = () => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        BETTING_PROGRAM_ID
    );
};

export const getVaultTokenAccount = async (tokenMint: PublicKey) => {
    const [vaultPDA] = getVaultPDA();
    return getAssociatedTokenAddress(tokenMint, vaultPDA, true);
};

export const createTokenAccount = (
    wallet: PublicKey,
    tokenMint: PublicKey,
    tokenAccount: PublicKey,
    owner: PublicKey
) => {

    try {
        const createAtaIx = createAssociatedTokenAccountInstruction(
            wallet,
            tokenAccount,
            owner,
            tokenMint,
            TOKEN_PROGRAM_ID
        );

        return createAtaIx;
    } catch (error) {
        console.error("Error creating vault token account:", error);
        throw error;
    }
};

export const initializeUser = async (
    program: Program,
    wallet: PublicKey
) => {
    const [stakerPDA] = getStakerPDA(wallet);

    try {
        const tx = await program.methods
            .initializeUser()
            .accounts({
                staker: stakerPDA,
                user: wallet,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction();

        return tx;
    } catch (error) {
        console.error("Error initializing user:", error);
        throw error;
    }
};

export const checkIfUserInitialized = async (
    program: Program,
    wallet: PublicKey
) => {
    const [stakerPDA] = getStakerPDA(wallet);

    try {
        await program.account.staker.fetch(stakerPDA);
        return true;
    } catch (error) {
        return false;
    }
};

export const initializeVault = async (
    program: Program,
    wallet: PublicKey
) => {
    const [vaultPDA] = getVaultPDA();

    try {
        const tx = await program.methods
            .initialize()
            .accounts({
                vault: vaultPDA,
                owner: wallet,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        return tx;
    } catch (error) {
        console.error("Error initializing vault:", error);
        throw error;
    }
};

export const checkIfVaultInitialized = async (
    program: Program,
) => {
    const [vaultPDA] = getVaultPDA();

    try {
        await program.account.vault.fetch(vaultPDA);
        return true;
    } catch (error) {
        return false;
    }
};

export const stakeTokens = async (
    program: Program,
    wallet: PublicKey,
    amount: number,
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey
) => {
    const [stakerPDA] = getStakerPDA(wallet);

    try {
        const isVaultInitialized = await checkIfVaultInitialized(program);
        if (!isVaultInitialized) {
            console.log("Vault not initialized, initializing first...");
            await initializeVault(program, wallet);
        }

        const isInitialized = await checkIfUserInitialized(program, wallet);
        if (!isInitialized) {
            console.log("User not initialized, initializing first...");
            await initializeUser(program, wallet);
        }

        const tx = await program.methods
            .stake(new BN(amount))
            .accounts({
                user: wallet,
                staker: stakerPDA,
                userTokenAccount,
                vaultTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction();

        return tx;
    } catch (error) {
        console.error("Error staking tokens:", error);
        throw error;
    }
};

export const unstakeTokens = async (
    program: Program,
    wallet: PublicKey,
    flag: number,
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey
) => {
    const [stakerPDA] = getStakerPDA(wallet);
    const [vaultPDA] = getVaultPDA();
    try {
        const isVaultInitialized = await checkIfVaultInitialized(program);
        if (!isVaultInitialized) {
            throw new Error("Vault not initialized. Please contact the administrator.");
        }

        const isInitialized = await checkIfUserInitialized(program, wallet);
        if (!isInitialized) {
            throw new Error("User not initialized. Please stake tokens first.");
        }

        const tx = await program.methods
            .unstake(flag)
            .accounts({
                staker: stakerPDA,
                admin: ADMIN_WALLET_ADDRESS,
                userTokenAccount,
                vaultTokenAccount,
                vault: vaultPDA,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        console.log("✅ Success. TX:", tx);
    } catch (error) {
        console.error("Error unstaking tokens:", error);
        throw error;
    }
};

export const getStakedAmount = async (
    program: Program,
    wallet: PublicKey
) => {
    const [stakerPDA] = getStakerPDA(wallet);

    try {
        const stakerAccount = await program.account.staker.fetch(stakerPDA);
        return stakerAccount.amountStaked.toNumber();
    } catch (error) {
        console.error("Error getting staked amount:", error);
        // Return 0 if there's an error (e.g., account doesn't exist)
        return 0;
    }
}; 