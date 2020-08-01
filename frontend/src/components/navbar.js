import React, {Component} from 'react';
import {Link} from 'react-router-dom'






export default class Navbar extends Component{
    render(){
        return(
            
                   
            <div className="sidebar">
                <h2>CodeonSteroids</h2>
                <ul>
                    <li><Link id="reload" to="/">VPN DETECTOR</Link></li>
                    <li><Link to="/who">WHOIS FETCH</Link></li>
                    <li><Link to="/advance">ADVANCE SCAN</Link></li>
                    
                    
                </ul> 
                
            </div>
            
            );
            }
            }

          