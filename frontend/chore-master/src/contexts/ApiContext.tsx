import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ChoreResponseDto } from '../Models/ChoreResponseDto';
import type { ChoreDto } from '../Models/ChoreDto';
import type { ChoreEditDto } from '../Models/ChoreEditDto';
import type { CompleteChoreDto } from '../Models/CompleteChoreDto';
import type { User } from '../Models/User';

interface ApiContextType {
    getAllChores: () => Promise<ChoreResponseDto[]>;
    getChoresByUser: (userId: number) => Promise<ChoreResponseDto[]>;
    createChore: (chore: ChoreDto) => Promise<any>;
    updateChore: (choreId: number, chore: ChoreEditDto) => Promise<any>;
    deleteChore: (choreId: number) => Promise<boolean>;
    completeChore: (request: CompleteChoreDto) => Promise<any>;
    getAllUsers: () => Promise<User[]>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BASE_URL = 'http://localhost:5272/api';

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const getAllChores = async (): Promise<ChoreResponseDto[]> => {
        const response = await fetch(`${BASE_URL}/chores/all`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const getChoresByUser = async (userId: number): Promise<ChoreResponseDto[]> => {
        const response = await fetch(`${BASE_URL}/chores/all/${userId}`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const createChore = async (chore: ChoreDto): Promise<any> => {
        const response = await fetch(`${BASE_URL}/chores/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chore)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const updateChore = async (choreId: number, chore: ChoreEditDto): Promise<any> => {
        const response = await fetch(`${BASE_URL}/chores/update/${choreId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chore)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const deleteChore = async (choreId: number): Promise<boolean> => {
        const response = await fetch(`${BASE_URL}/chores/${choreId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*'
            }
        });

        return response.ok;
    };

    const getAllUsers = async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users/all`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const completeChore = async (request: CompleteChoreDto): Promise<any> => {
        const response = await fetch(`${BASE_URL}/chores/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const value: ApiContextType = {
        getAllChores,
        getChoresByUser,
        createChore,
        updateChore,
        deleteChore,
        completeChore,
        getAllUsers
    };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = (): ApiContextType => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
