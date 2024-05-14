import { BaseRequest, BaseResponse } from './baseMethod';
export interface ServerInfoRequest extends BaseRequest {
    command: 'server_info';
}
export type ServerState = 'disconnected' | 'connected' | 'syncing' | 'tracking' | 'full' | 'validating' | 'proposing';
export interface StateAccounting {
    duration_us: string;
    transitions: string;
}
export interface JobType {
    job_type: string;
    per_second: number;
    peak_time?: number;
    avg_time?: number;
    in_progress?: number;
}
export type protocol = 'http' | 'https' | 'grpc' | 'peer' | 'ws' | 'ws2' | 'wss' | 'wss2';
export interface ServerPort {
    port: string;
    protocol: protocol[];
}
export type StateAccountingFinal = Record<Exclude<ServerState, 'validating' | 'proposing'>, StateAccounting>;
export interface ServerInfoResponse extends BaseResponse {
    result: {
        info: {
            amendment_blocked?: boolean;
            build_version: string;
            closed_ledger?: {
                age: number;
                base_fee_xrp: number;
                hash: string;
                reserve_base_xrp: number;
                reserve_inc_xrp: number;
                seq: number;
            };
            complete_ledgers: string;
            hostid: string;
            io_latency_ms: number;
            jq_trans_overflow: string;
            last_close: {
                converge_time_s: number;
                proposers: number;
            };
            load?: {
                job_types: JobType[];
                threads: number;
            };
            load_factor?: number;
            network_id?: number;
            load_factor_local?: number;
            load_factor_net?: number;
            load_factor_cluster?: number;
            load_factor_fee_escalation?: number;
            load_factor_fee_queue?: number;
            load_factor_server?: number;
            peer_disconnects?: string;
            peer_disconnects_resources?: string;
            network_ledger?: 'waiting';
            peers: number;
            ports: ServerPort[];
            pubkey_node: string;
            pubkey_validator?: string;
            server_state: ServerState;
            server_state_duration_us: string;
            state_accounting: StateAccountingFinal;
            time: string;
            uptime: number;
            validated_ledger?: {
                age: number;
                base_fee_xrp: number;
                hash: string;
                reserve_base_xrp: number;
                reserve_inc_xrp: number;
                seq: number;
            };
            validation_quorum: number;
            validator_list_expires?: string;
            validator_list?: {
                count: number;
                expiration: 'never' | 'unknown' | string;
                status: 'active' | 'expired' | 'unknown';
            };
        };
    };
}
//# sourceMappingURL=serverInfo.d.ts.map