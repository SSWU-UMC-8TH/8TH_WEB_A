import { Link, Outlet } from 'react-router-dom';


const HomeLayout = () => {
  return (
    <div>
      <header style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', gap: '8rem',justifyContent: 'center' }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/mypage">MyPage</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>UMC 스터디</p>
      </footer>
    </div>
  );
};

export default HomeLayout;
