# This project contains the following technologies

Authentication and User Management:
- Bcrypt.ts (password hashing)
- Firebase (storage)
- NextAuth 5 (authentication)

Core Technologies:
- React 19
- TypeScript
- Next 16 (framework)

Data Fetching and State Management:
- Axios (sending requests to backend)
- Prisma 7 (ORM for DB)
- React Query (TanStack Query) (data fetching and state management)
- Zustand (state management)

Form and Validation:
- React Hook Form (working with forms)
- Zod (first schema validation)

Middleware and Server Utilities:
- Concurrently (all projects are running in tandem)

Styling and UI Frameworks:
- Lucide React (stylization)
- Next Themes (using theme switcher)
- shadcn/ui (stylization)
- Tailwind CSS (stylization)
- Sonner (stylization)

Utilities and Libraries:
- Date-fns (date/time manipulation)
- Knip (code analyzer and declutter)
- next-intl (internationalization)
- PostCSS (transforms CSS code to AST)
- Prettier (code formatter)
- Recharts (visualization graphs and charts)



# Project setup commands:
terminal powershell -> `npm i` (install dependencies)
terminal powershell -> `npx npm-check-updates --interactive` (update dependencies)
terminal powershell -> `npm run all`
terminal powershell -> `npm run lint` (loading ESLint checker)
terminal powershell -> `npm run types` (loading TypeScript checker)
terminal powershell -> `npm run knip` (loading Knip checker)

# Database commands:
terminal powershell -> `npx prisma generate`
terminal powershell -> `npx prisma db push`
terminal powershell -> `npx prisma migrate reset`

terminal powershell -> `npx prisma db seed` (loading test DB)

# GitHub commands:
terminal powershell -> `git pull origin master` (get latest changes)

terminal powershell -> `git add .` (add all changes)
terminal powershell -> `git commit -m "commit message"` (commit changes)
terminal powershell -> `git checkout -b <branch-name>` (create new branch)

terminal powershell -> `git push origin master` (push changes to master)
terminal powershell -> `git push origin master:<branch-name>` (if branch already exists)
terminal powershell -> `git push origin <branch-name>` (push changes to branch)