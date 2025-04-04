import { useTheme, THEME } from './ThemeProvider';

export default function ThemeContent() {
  const { theme } = useTheme();
  const isLight = theme === THEME.LIGHT;

  return (
    <div className={`p-8 transition-colors ${isLight ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <h1 className="text-4xl font-bold mb-4"></h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque recusandae, molestias tempora rem accusamus ab delectus saepe quia ea, doloribus aliquam? Nostrum possimus dignissimos doloremque asperiores tenetur est officia deserunt?
      </p>
    </div>
  );
}
