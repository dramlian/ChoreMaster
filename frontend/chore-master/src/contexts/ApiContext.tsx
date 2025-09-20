import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ChoreResponseDto } from '../Models/ChoreResponseDto';
import type { ChoreDto } from '../Models/ChoreDto';
import type { ChoreEditDto } from '../Models/ChoreEditDto';
import type { CompleteChoreDto } from '../Models/CompleteChoreDto';
import type { ChoreHistoryDto } from '../Models/ChoreHistoryDto';
import type { User } from '../Models/User';
import { useAuth } from './AuthContext';

interface ApiContextType {
    getAllChores: () => Promise<ChoreResponseDto[]>;
    getChoresByUser: (userId: number) => Promise<ChoreResponseDto[]>;
    createChore: (chore: ChoreDto) => Promise<any>;
    updateChore: (choreId: number, chore: ChoreEditDto) => Promise<any>;
    deleteChore: (choreId: number) => Promise<boolean>;
    completeChore: (request: CompleteChoreDto) => Promise<any>;
    getAllUsers: () => Promise<User[]>;
    getChoreHistory: (choreId: number) => Promise<ChoreHistoryDto[]>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BASE_URL = 'https://choremaster-backend--gl9nk3o.wonderfulpond-00f239f0.westeurope.azurecontainerapps.io/api';

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const { token } = useAuth();

    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'accept': 'text/plain'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    };

    const getAuthHeadersWithContentType = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    };

    const getAllChores = async (): Promise<ChoreResponseDto[]> => {
        const response = await fetch(`${BASE_URL}/chores/all`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const getChoresByUser = async (userId: number): Promise<ChoreResponseDto[]> => {
        const response = await fetch(`${BASE_URL}/chores/all/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const createChore = async (chore: ChoreDto): Promise<any> => {
        const response = await fetch(`${BASE_URL}/chores/create`, {
            method: 'POST',
            headers: getAuthHeadersWithContentType(),
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
            headers: getAuthHeadersWithContentType(),
            body: JSON.stringify(chore)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const deleteChore = async (choreId: number): Promise<boolean> => {
        const headers: Record<string, string> = {
            'accept': '*/*'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/chores/${choreId}`, {
            method: 'DELETE',
            headers
        });

        return response.ok;
    };

    const getAllUsers = async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users/all`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const completeChore = async (request: CompleteChoreDto): Promise<any> => {
        const response = await fetch(`${BASE_URL}/chores/complete`, {
            method: 'PUT',
            headers: getAuthHeadersWithContentType(),
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    const getChoreHistory = async (choreId: number): Promise<ChoreHistoryDto[]> => {
        const response = await fetch(`${BASE_URL}/chores/${choreId}/history`, {
            method: 'GET',
            headers: getAuthHeaders()
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
        getAllUsers,
        getChoreHistory
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
