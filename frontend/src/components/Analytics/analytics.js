import React, { Component } from 'react';
import { Container, TextField, IconButton, InputAdornment, Grid, Paper } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';



export default class Analytics extends Component {
 render(){
    
     return(
         <Container>
             <Grid  container spacing={3}>
                 
             <Grid item xs={12} md={4} sm={6}>
                 <Card >
                    <CardContent>
                        <Typography variant="h5" color="textSecondary" gutterBottom>
                        Model accuracy
                        </Typography>
                        <Typography variant="h2">
                        70% 
                        </Typography>
                    </CardContent>
                 </Card>
                  </Grid>

                  <Grid item  xs={12} md={4} sm={6}>
                 <Card >
                    <CardContent>
                        <Typography variant="h5" color="textSecondary" gutterBottom>
                        Dataset
                        </Typography>
                        <Typography variant="h2" >
                        50000
                        </Typography>
                    </CardContent>
                 </Card>
                  </Grid>

                  <Grid item xs={12} md={4} sm={6}>
                 <Card >
                    <CardContent>
                        <Typography variant="h5" color="textSecondary" gutterBottom>
                        Training
                        </Typography>
                        <Typography variant="h2" >
                        6000
                        </Typography>
                    </CardContent>
                 </Card>
                  </Grid>

             </Grid>
         </Container>
     );
 }


}