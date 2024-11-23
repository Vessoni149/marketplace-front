import React from 'react';
import './sideBar.css';
import {ListItemMenu} from './ListItemMenu/ListItemMenu';
export function SideBar({setShowBarsMenu}) {
    const name = localStorage.getItem("fullName");

    return (
        <>
        <div className='lateral-bar-container'>
            <div className='title-barsMenu-container'>
                {name ? (
                    <h3 className='title-barsMenu'>Hello {name}</h3>
                ): 
                    <h3 className='title-barsMenu'>Hello Guest! </h3>
                }
                
                <span onClick={()=>{setShowBarsMenu(false)}}
                className='close-btn-barsMenu'>X</span>
            </div>
            <div className='info-p-container'>
                <p className='info-p'>This sidebar is merely demonstrative and does not have any functionality at the moment.</p>
            </div>
            <div>
                <h5>Content & digital devices</h5>
                <ul>
                    <ListItemMenu itemList="Amazon Music"/>
                    <ListItemMenu itemList="E-readers Kindle & Books"/>
                    <ListItemMenu itemList="Amazon't Appstore"/>
                </ul>
            </div>
            <div>
                <h5>Search by department</h5>
                <ul>
                    <ListItemMenu itemList="Electronic"/>
                    <ListItemMenu itemList="Computers"/>
                    <ListItemMenu itemList="Smart Home"/>
                    <ListItemMenu itemList="Art & Crafts"/>
                    <div className='title-barsMenu-container'>
                        <li className='li-see-all'>See all 
                            <span className='span-arrow-down-barsMenu'>&gt;</span>
                        </li>
                    </div>
                </ul>
            </div>
            <div>
                <h5>Programs & Features</h5>
                <ul>
                    <ListItemMenu itemList="Gift Cards"/>
                    <ListItemMenu itemList="Shop By Interest"/>
                    <ListItemMenu itemList="Amazon't Live"/>
                    <ListItemMenu itemList="International Shopping"/>
                    <div className='title-barsMenu-container'>
                        <li className='li-see-all'>See all 
                            <span className='span-arrow-down-barsMenu'>&gt;</span>
                        </li>
                    </div>
                </ul>
            </div>
            <div>
                <h5>Help & Settings</h5>
                <ul>
                    <li className='li-hys'>Your Account</li>
                    <li className='li-hys'>🗣️English</li>
                    <li className='li-hys'>🌐United States</li>
                    <li className='li-hys'>Customer Service</li>
                    
                </ul>
            </div>
        </div>
            
        </>
    )
}
