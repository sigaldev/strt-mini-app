import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@maxhub/max-ui/dist/styles.css';
import {MaxUI} from "@maxhub/max-ui";

createRoot(document.getElementById('root')!).render(
    <MaxUI colorScheme="light">
        <App />
    </MaxUI>
)
