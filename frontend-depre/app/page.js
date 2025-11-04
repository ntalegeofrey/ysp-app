import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Hello YSP</h1>
      <p>Welcome to the YSP App</p>
      <p>Version 1.0.0</p>
    </div>
  );
}
