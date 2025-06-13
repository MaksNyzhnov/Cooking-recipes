import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RecipeList } from './components/RecipeList/RecipeList';
import { RecipeDetail } from './components/RecipeDetail/RecipeDetail';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/" className={styles.headerTitle}>
            <h1>Cooking Recipes</h1>
          </Link>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
