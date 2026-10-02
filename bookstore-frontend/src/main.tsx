import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const client=new ApolloClient({
  link: new HttpLink({uri:import.meta.env.VITE_GRAPHQL_URI}),
  cache:new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
