import React from 'react'

const Footer = () => {
    return (
        <div className="bg-gray-200 left-0 z-20 w-full border-t border-gray-200 shadow md:flex   md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 
                <a href="https://flowbite.com/" className="hover:underline">Web Technology & E-Service</a>.
            </span>
            <span className="text-2xl">Group 21</span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">About</a>
                </li>
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </div>

    )
}

export default Footer