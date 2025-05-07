import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-3 mt-auto">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} UMC MOCA. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to={"#"}>Pricacy Policy</Link>
          <Link to={"#"}>Terms of Service</Link>
          <Link to={"#"}>Contact</Link>
        </div>
      </div>
    </footer>

  )
}
