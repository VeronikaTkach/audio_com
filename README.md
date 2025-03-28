# AudioCom

**Live Demo:** [https://audiocom-veronika.vercel.app](https://audiocom-veronika.vercel.app)

AudioCom is a web platform built with Supabase as the backend service. It includes functionality for both administrators and regular users.

## ✅ Features

- Authentication system for admin and users  
- Admin/editor interface to manage content  
- Supabase integration for backend and database  
- Infinite scroll pagination  
- Album filtering by name, release year, and genres  
- Add/edit album features for editors  
- Light and dark theme switching  
- Favorites system: add/remove albums to favorites  
- Lazy preload of a default image while album covers are being fetched  
- Deployed on Vercel  

## ✅ Credentials

### Editor (Admin)
- **Login:** admin@admin.com  
- **Password:** 123456

### Regular User
- **Login:** user@user.com  
- **Password:** 123456

## ✅ Technologies Used

- **Frontend:** React (with Vite)  
- **Language:** JavaScript  
- **State Management:** Redux Toolkit  
- **HTTP Client:** Axios  
- **Styling:** SASS/SCSS, Styled-components  
- **Utilities:** Lodash  
- **Notifications:** React Toastify  
- **Code Quality:** ESLint + Prettier

## ✅ React Hooks

This project makes use of several built-in React hooks:

- `useState`  
- `useEffect`  
- `useSelector`  
- `useDispatch`  
- `useNavigate`  
- `useLocation`  
- `useParams`  
- `useCallback`

In addition, custom hooks were created for improved reusability and project structure.

## ✅ Infinite Scroll Pagination

The app implements infinite scrolling by initially loading 10 items from the database. As the user scrolls, the app checks how many items remain in the database and loads the next 10 if available. When fewer than 10 items are left, the remaining items are loaded, and further backend requests stop.

## ✅ Filters

Users can filter albums by:
- Name  
- Release Year  
- Genre  

## ✅ Editor Role Features

Users with the **Editor** role have access to:
- Adding new albums  
- Editing existing albums  

## ✅ UI Experience

- Lazy loading of a default image while unique album covers load from the database  
- Light and dark theme switching  
- Favorites system for saving preferred albums  

## ✅ About the Project

This project was created as part of an advanced React training course from **The Muse Group**. It was designed to deepen practical understanding of modern React architecture and ecosystem tools.
