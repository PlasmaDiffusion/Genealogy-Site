import React, { useEffect , useState } from 'react';

import "./navbar.scss";

function Navbar(props){

    //Link and name objects
    const [rootFamily, setRootFamily] = useState(0);
    const [subFamily, setSubFamily] = useState(0);
    

    // Look at the url and set the nav links accordingly
    useEffect(() => {

        let queryString = window.location.search

        //Setting the url doesn't seem to work in testing library so use this instead
        if (props.testing) queryString="?id=6026db4c101140001773428d&subFamilyName=McNee%201877&rootName=McNee";


        const urlParams = new URLSearchParams(queryString);
        var rootName = urlParams.get("rootName");
        var subFamilyName = urlParams.get("subFamilyName");


        //Home > Family link
        setRootFamily({link: "/familyTree/ ?rootName=" + rootName, name: rootName});

        //Home > Family > Sub Family text
        setSubFamily({name: subFamilyName });

    }, []);
    //[] means useEffect() will be called only once

    return (
    <div className="navbar">
        <a href="/" className="navLink">
        Home </a>
        { //Return 1 or 2 links next to the home link
        rootFamily.name ? ( 
        <a href={rootFamily.link} className="navLink"> > {rootFamily.name} Tree </a>) :  "" }
        {subFamily.name ?(
        <a href="" className="navLink"> > {subFamily.name} </a>) :  "" }

      <br></br>
    </div>
    );

}
    


export default Navbar;

