import { createFungible, createV1, mintV1, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);

umi.use(keypairIdentity(keypair)).use(mplTokenMetadata());

const metadata = {
  name: "Solana Gold",
  symbol: "GOLDSOL",
  uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

const mint = generateSigner(umi);

async function mintToken() {
  await mintV1(umi, {
    mint: mint.publicKey,
    authority: umi.identity,
    amount: 10_000,
    tokenOwner: umi.identity.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
}

async function createMetadataDetails() {
  await createV1(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
}

async function createFungibleToken() {
  await createFungible(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
  }).sendAndConfirm(umi);
}

async function main() {
  await mintToken();
  await createMetadataDetails();
  await createFungibleToken();
}

main().catch(console.error);
