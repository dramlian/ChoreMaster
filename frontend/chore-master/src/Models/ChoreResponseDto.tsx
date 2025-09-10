export interface ChoreResponseDto {
    id: number;
    name: string;
    lastCompleted: string;
    threshold: number;
    assignedTo: number | null;
    isReassignedable: boolean;
    history: any[];
    timeLeft: string;
}
