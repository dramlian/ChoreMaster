import DotLoader from "react-spinners/DotLoader";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <div className={styles.overlay}>
          <DotLoader color="#000000ff" size={60} />
        </div>
      )}
    </>
  );
}