export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-auto py-4 shadow-inner">
      <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-300">
        <p>&copy; {new Date().getFullYear()} Starlight Critter Story. All rights reserved.</p>
      </div>
    </footer>
  );
} 