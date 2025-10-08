export default function scrollToSection( id: string ) {
  const element = document.getElementById( id )

  if ( element ) {
    element.scrollIntoView( {
      behavior : "smooth", // Enable smooth scrolling
      block    : "start", // Scroll to the top of the element
    } )
  }
}
