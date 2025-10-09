const formatRupiah = ( val: string | number, withoutText: boolean = false ) => {
    if ( !val ) return "0"
    const number = String( val )
    const parsed = parseInt( number.replace( /\D/g, "" ), 10 )
    if ( isNaN( parsed ) ) return ""

    if ( withoutText )
    return parsed.toLocaleString( "id-ID" )
    else return `Rp. ${parsed.toLocaleString( "id-ID" ) || 0}`
}

export default formatRupiah