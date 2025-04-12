import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brown-200 py-10 flex flex-col gap-6 items-center sm:flex-row sm:justify-between sm:px-32">
      <div className="flex items-center gap-6 justify-center">
        <p className="font-medium text-brown-500 select-none">Get in touch</p>
        <div className="flex gap-4">
          {/* LinkedIn */}
          <a
            className="cursor-pointer"
            href="https://www.linkedin.com/in/yotsathon-rittisornthanoo-5a1211236/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-brown-500"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24ZM16.9605 19.8778H11.5216V36.2196H16.9605V19.8778ZM17.3188 14.8227C17.2835 13.2204 16.1377 12 14.277 12C12.4164 12 11.2 13.2204 11.2 14.8227C11.2 16.3918 12.3805 17.6473 14.2064 17.6473H14.2412C16.1377 17.6473 17.3188 16.3918 17.3188 14.8227ZM36.5754 26.8497C36.5754 21.8303 33.8922 19.4941 30.3131 19.4941C27.4254 19.4941 26.1325 21.0802 25.4107 22.1929V19.8783H19.9711C20.0428 21.4117 19.9711 36.22 19.9711 36.22H25.4107V27.0934C25.4107 26.605 25.446 26.1178 25.5898 25.7682C25.9829 24.7924 26.8779 23.7822 28.3805 23.7822C30.3494 23.7822 31.1365 25.2807 31.1365 27.4767V36.2196H36.5752L36.5754 26.8497Z"
                fill="#0077B5"
              />
            </svg>
          </a>

          {/* GitHub */}
          <a
            className="cursor-pointer"
            href="https://github.com/ritchie-gr8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.0435 0.180176C10.8149 0.180176 0.0878906 11.0881 0.0878906 24.5447C0.0878906 35.3098 6.95189 44.4428 16.4702 47.6646C17.6674 47.8901 18.1069 47.136 18.1069 46.4925C18.1069 45.9115 18.0847 43.9921 18.0744 41.9562C11.4099 43.4301 10.0037 39.0815 10.0037 39.0815C8.91394 36.2652 7.34382 35.5164 7.34382 35.5164C5.17034 34.0042 7.50766 34.0352 7.50766 34.0352C9.91321 34.2067 11.1799 36.546 11.1799 36.546C13.3165 40.2709 16.784 39.194 18.151 38.5715C18.366 36.9971 18.9868 35.9215 19.6719 35.3134C14.351 34.6973 8.75764 32.6081 8.75764 23.2722C8.75764 20.6121 9.69344 18.4386 11.2259 16.7323C10.9771 16.1182 10.1572 13.6405 11.4579 10.2844C11.4579 10.2844 13.4696 9.62952 18.0474 12.7819C19.9583 12.242 22.0076 11.9713 24.0435 11.962C26.0793 11.9713 28.1302 12.242 30.0447 12.7819C34.6169 9.62952 36.6258 10.2844 36.6258 10.2844C37.9297 13.6405 37.1094 16.1182 36.8606 16.7323C38.3966 18.4386 39.3261 20.6121 39.3261 23.2722C39.3261 32.6303 33.722 34.6909 28.3877 35.2941C29.2469 36.0502 30.0125 37.5329 30.0125 39.8061C30.0125 43.0658 29.9848 45.6896 29.9848 46.4925C29.9848 47.1409 30.416 47.9006 31.6302 47.6613C41.1434 44.436 47.9986 35.3062 47.9986 24.5447C47.9986 11.0881 37.2732 0.180176 24.0435 0.180176Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.16108 35.1625C9.10832 35.284 8.92108 35.3199 8.7505 35.2368C8.57675 35.1573 8.47916 34.9923 8.53549 34.8708C8.58706 34.7462 8.7747 34.7119 8.94806 34.7946C9.1222 34.8745 9.22138 35.0411 9.16108 35.1625Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.1314 36.2632C10.0171 36.3709 9.79381 36.3209 9.64227 36.1506C9.48558 35.9808 9.45622 35.7536 9.57206 35.6443C9.68987 35.5366 9.90647 35.587 10.0636 35.7568C10.2203 35.9287 10.2508 36.1543 10.1314 36.2632Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0759 37.6665C10.9291 37.7702 10.6891 37.6729 10.5408 37.4563C10.394 37.2396 10.394 36.9798 10.544 36.8757C10.6927 36.7716 10.9291 36.8652 11.0795 37.0802C11.2259 37.3001 11.2259 37.5604 11.0759 37.6665Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.3699 39.0222C12.2386 39.1694 11.959 39.1299 11.7543 38.929C11.5448 38.7325 11.4865 38.4537 11.6182 38.3064C11.7511 38.1587 12.0324 38.2003 12.2386 38.3996C12.4465 38.5957 12.51 38.8765 12.3699 39.0222Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.1551 39.8093C14.0971 40.0002 13.8278 40.0869 13.5565 40.0058C13.2855 39.9223 13.1082 39.6988 13.1629 39.5059C13.2193 39.3139 13.4898 39.2235 13.7631 39.3102C14.0337 39.3934 14.2114 39.6153 14.1551 39.8093Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.1155 39.9554C16.1223 40.1563 15.8922 40.323 15.6074 40.3262C15.3209 40.333 15.0893 40.1704 15.0861 39.9727C15.0861 39.7698 15.311 39.6048 15.5974 39.5999C15.8823 39.5943 16.1155 39.7557 16.1155 39.9554Z"
                fill="black"
                className="fill-brown-500"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.9399 39.6395C17.974 39.8356 17.7761 40.0369 17.4932 40.0902C17.2152 40.1422 16.9577 40.0212 16.9224 39.8267C16.8879 39.6258 17.0894 39.4244 17.3671 39.3724C17.6503 39.3223 17.9038 39.4402 17.9399 39.6395Z"
                fill="black"
                className="fill-brown-500"
              />
            </svg>
          </a>

          {/* Email */}
          <a
            className="cursor-pointer"
            href="mailto:rit.yotsathon@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24ZM23.9654 17.6213C25.9154 17.6213 27.2309 18.4649 27.9809 19.1698L30.9118 16.304C29.1117 14.6284 26.7693 13.6 23.9654 13.6C19.9037 13.6 16.3959 15.9342 14.6881 19.3316L18.0459 21.9431C18.8883 19.4356 21.2191 17.6213 23.9654 17.6213ZM33.935 24.2311C33.935 23.376 33.8657 22.752 33.7157 22.1049H23.9654V25.9644H29.6887C29.5733 26.9236 28.9502 28.368 27.5655 29.3387L30.8425 31.8809C32.8041 30.0667 33.935 27.3973 33.935 24.2311ZM18.0575 26.0569C17.8382 25.4098 17.7113 24.7164 17.7113 24C17.7113 23.2836 17.8382 22.5902 18.0459 21.9431L14.6881 19.3316C13.9842 20.7413 13.5804 22.3244 13.5804 24C13.5804 25.6756 13.9842 27.2587 14.6881 28.6684L18.0575 26.0569ZM23.9654 34.4C26.7693 34.4 29.1232 33.4756 30.8425 31.8809L27.5655 29.3387C26.6885 29.9511 25.5116 30.3787 23.9654 30.3787C21.2191 30.3787 18.8883 28.5644 18.0575 26.0569L14.6996 28.6684C16.4074 32.0658 19.9037 34.4 23.9654 34.4Z"
                fill="#EA4335"
                className="fill-brown-500"
              />
            </svg>
          </a>
        </div>
      </div>
      <Link to={"/"}>
        <button className="cursor-pointer underline select-none font-medium text-brown-600">
          Home page
        </button>
      </Link>
    </footer>
  );
};

export default Footer;
