import { Offcanvas } from "react-bootstrap";
import { useApi } from '../../contexts/ApiContext';
import type { ChoreHistoryDto } from "../../Models/ChoreHistoryDto";
import { useState, useEffect } from "react";

interface HistoryProps {
    showHistoryModal: boolean;
    setShowHistoryModal: (show: boolean) => void;
    choreId: number | null;
}

const History = ({ showHistoryModal, setShowHistoryModal, choreId }: HistoryProps) => {
    const { getChoreHistory } = useApi();
    const [choreHistory, setChoreHistory] = useState<ChoreHistoryDto[]>([]);

    useEffect(() => {
        const fetchChoreHistory = async () => {
            try {
                if (choreId) {
                    const history = await getChoreHistory(choreId);
                    setChoreHistory(history);
                }
            } catch (error) {
                console.error('Error fetching chore history:', error);
            }
        };

        fetchChoreHistory();
    }, [choreId]);

    return (
        <Offcanvas show={showHistoryModal} onHide={setShowHistoryModal}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Chore History</Offcanvas.Title>
            </Offcanvas.Header>
        <Offcanvas.Body>
          {choreHistory.length === 0 ? (
            <p>No history available for this chore.</p>
          ) : (
            <ul className="list-group">
              {choreHistory.map((entry) => (
                <li key={entry.id} className="list-group-item">
                  <strong>{new Date(entry.dateTime).toLocaleString()}:</strong> {entry.message}
                </li>
              ))}
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    );
};

export default History;
