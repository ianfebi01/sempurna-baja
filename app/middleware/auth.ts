import { useAuth } from "~/compossables/useAuth"

export default defineNuxtRouteMiddleware( ( to ) => {
  const { loggedIn } = useAuth()
  const authPages = ["/login", "/register"]

  // Redirect logged-in users away from login/register
  if ( authPages.includes( to.path ) && loggedIn.value )
    return navigateTo( "/admin" )

  // Redirect guests away from protected routes like /admin
  if ( !loggedIn.value && to.path.startsWith( "/admin" ) )
    return navigateTo( "/login" )
} )
