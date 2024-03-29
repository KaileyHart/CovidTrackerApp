import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "../InfoBoxes/InfoBox.css";

function InfoBox({ title, cases, active, isRed, total, ...props }) {

  return (
    <div className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>

      <Card onClick={props.onClick}>
        <CardContent>
        
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>

          <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
            {cases}
          </h2>

          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>

        </CardContent>
      </Card>

    </div>
  );
}

export default InfoBox;
