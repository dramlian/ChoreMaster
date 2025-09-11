import type { User } from "./User";

export interface ChoreResponseDto {
    id: number;
    name: string;
    lastCompleted: string;
    threshold: number;
    assignedTo: User;
    isReassignedable: boolean;
    history: any[];
    timeLeft: string;
}
