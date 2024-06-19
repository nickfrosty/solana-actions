/**
 * Solana Actions Example
 */

import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  MEMO_PROGRAM_ID,
  ActionGetResponse,
  ActionPostRequest,
} from "@/lib/actions";
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "Actions Example - Simple On-chain Memo",
    icon: new URL("/solana_devs.jpg", new URL(req.url).origin).toString(),
    description: "Send a message on-chain using a Memo",
    label: "Send Memo",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const signer = Keypair.generate();
    const transaction = new Transaction();
    transaction.feePayer = account;
    // transaction.feePayer = signer.publicKey;
    // transaction.recentBlockhash = new PublicKey(0).toBase58();

    transaction.add(
      // note: `createPostResponse` requires at least 1 non-memo instruction
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from("this is a simple memo message", "utf8"),
        keys: [
          {
            isSigner: true,
            isWritable: false,
            pubkey: signer.publicKey,
          },
        ],
      }),
    );

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Post this memo on-chain",
      },
      signers: [signer],
    });

    // console.log("base64 transaction:", payload.transaction);

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
