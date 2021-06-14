import React, { useState, useEffect } from 'react';

//FamilyLinkTree will render this by passing in several props
function FamilyGrid(props)
{
    
    //Grid size goes here
    const rows = 5;
    const cols = 5;
    const [rowArray, setRowArray] = useState([]);

    //Initialize array to whatever size
    useEffect(() =>{
        let array = [];
        for (let i = 0; i < rows; i++) array.push("");
        setRowArray(array);
        
    }, []);


  //Either return the family of the particular index or return nothing if it doesn't exist (Either an empty grid or nothing will be returned)
  function displayFamily(i, mobileRender) {
    return props.familyNames[i] || props.families[i] ? (
      props.onHomePage ? (
        <FamilyLink name={props.familyNames[i]} key={i} onHomePage={true} />
      ) : (
        <FamilyLink
          name={props.families[i].name}
          key={i}
          onHomePage={false}
          _id={props.families[i]._id}
          baseId={props.rootFamilyId}
          rootName={props.rootFamilyName}
        />
      )
    ) : (
      <h2 style={{ visibility: "hidden", display: (mobileRender ? "none" : "block") }}>|</h2>
    );
  }

  //Get a single family
  function getTreeColumn(index, mobileRender) {
    if (mobileRender)
    {return <div className="row">{displayFamily(index, mobileRender)}
    </div>}
    else
    return <div className="col-sm-2">{displayFamily(index, mobileRender)}</div>;
  }

  //Get a row of several families
 function getTreeRow(index, mobileRender) {
    //Simulate a for loop
    let colArray = [];
    for (let i = 0; i < cols; i++) colArray.push("");

    if (mobileRender)
    return (
      colArray.map((val, i) => getTreeColumn(index + i, mobileRender))
    );
    else
    return (
      <div className="row">
        {colArray.map((val, i) => getTreeColumn(index + i, mobileRender))}
      </div>
    );
  }

    return (
      <React.Fragment>
        <h1 className="treeBg treeTitle smallFont-mobile">
          {props.rootFamilyName ? props.rootFamilyName + " Family Tree" : "Pick A Family"}
        </h1>
        <div className="loading" style={{display: props.familyNames.length > 0 || !props.onHomePage ? "none" : "block"}}>Loading families...</div>
        <div className="treeBg">
          {/*<h1 className="d-flex justify-content-center">Creating Family Trees</h1>*/}
          <img
            src={process.env.PUBLIC_URL + "/images/bigTree.png"}
            className="img-fluid treeImg"
          ></img>
          {/* Render family grid */}
          <div className="container position-absolute img-fluid treeLink desktopOnly">
            {rowArray.map((val, index) => getTreeRow(index * cols, false))}
          </div>
          {/* Render family as a list for mobile */}
          <div className="container position-absolute img-fluid treeLink mobileOnly">
            {rowArray.map((val, index) => getTreeRow(index * cols, true))}
          </div>
          {/*
              <h2 style={{ visibility: "hidden" }}> | </h2>
        */}
        </div>
        {/* Extra blue background when page is height is more on mobile */}
        <div className="treeBg mobileOnly" >
          <div style={{padding: "30%"}}></div>
        </div>
        
      </React.Fragment>
    );
  }


//Put links here to either a family tree page (when on the home page) or a link to a specific family
const FamilyLink = (props) => (
  <React.Fragment>
    <h2 className=" d-flex justify-content-center familyLink">
      {props.onHomePage ? (
        <a href={"/familyTree/ ?rootName=" + props.name}>{props.name}</a>
      ) : (
        <a href={"/family/ ?id=" + props._id  + "&subFamilyName=" + props.name + "&rootName="+ props.rootName}>
          {props.name /* + "&baseId=" + props.baseId */}
        </a>
      )}
    </h2>
  </React.Fragment>
);

export default FamilyGrid;