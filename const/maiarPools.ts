import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";

export const devnet: IPool[] = [];


export const MAIAR_POOLS = ENVIRONMENT.NETWORK == "devnet" ? devnet : [];
