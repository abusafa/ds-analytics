import React, {Component} from 'react';

import '../node_modules/antd/dist/antd.min.css';
import './App.css';
import logo from './logo.svg';
import dslogo from './img/ds.png';
import {Link, BrowserRouter as Router, Route} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';
const {Header, Sider, Content} = Layout;
import Particles from 'react-particles-js';

import PharmaciesAccessibleWithin from './components/PharmaciesAccessibleWithin.js';
import Hexbinned from './components/Hexbinned.js';
class App extends Component {

    constructor() {
        super();
        this.state = {
            collapsed: false
        };
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <Router>

                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div style={{ textAlign: 'center',padding: 20}}>
                          <img style={{width: 80}} src={dslogo} />
                        </div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/">
                                    <Icon type="user"/>
                                    <span className="nav-text">Home</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/accessible-within">
                                    <Icon type="video-camera"/>
                                    <span className="nav-text">Accessible Within</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/hexbinned">
                                    <Icon type="upload"/>
                                    <span className="nav-text">Hexbinned</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{
                            background: '#fff',
                            padding: 0
                        }}>
                            <Icon className="trigger" type={this.state.collapsed
                                ? 'menu-unfold'
                                : 'menu-fold'} onClick={() => this.toggle()}/>
                        </Header>
                        <Content style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280
                        }}>

                            <Route exact={true} path="/" render={()=>(
                              <div style={{backgroundColor:"rgb(13, 47, 84)"}}>
                                <div style={{    position: 'absolute',
    textAlign: 'center',
    width: '80%',
    top: 194}}>
                                  <h1 style={{    color: '#fff',fontSize: 40}}>
                                    <img style={{width: 150}} src={dslogo} />
                                    <br />
                                    Dorchester Estates Analytics
                                  </h1>
                                </div>

                              <Particles  />
                            </div>
                            )}/>
                            <Route path="/accessible-within" component={PharmaciesAccessibleWithin}/>
                            <Route path="/hexbinned" component={Hexbinned}/>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;
