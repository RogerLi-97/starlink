import React, {Component} from 'react';
import {Button, List, Avatar, Checkbox, Spin} from "antd";
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    constructor() {
        super();
        this.state = {
            selected: [],
            isLoad: false,
        };
    }

    onChange = e => {
        // get sat info and check status
        const {dataInfo, checked} = e.target;
        const {selected} = this.state;
        // add or remove the sat to selected satList
        const list = this.addOrRemove(dataInfo, checked, selected); // list包含当前所有选中的卫星的Info
        // setState -> selected
        this.setState({selected: list});
        console.log(e.target);
    }

    addOrRemove = (item, status, list) => {
        // case 1: checked status is true
        // - item not in the list => add it
        // - item is in the list => do nothing
        const found = list.some( entry => entry.satid === item.satid);  // 使用array的some方法判断该satid的卫星是否在list中
        if(status && !found){
            list = [...list, item]; // 这里是返回一个新的array，push方法是在原来的array中增加元素
        }

        // case 2: checked status is false
        // - item not in the list => do nothing
        // - item is in the list => remove
        if(!status && found){
            list = list.filter( entry => {  // remove the sat
                return entry.satid !== item.satid;
            });
        }
        return list;
    }

    onShowSatMap = () =>{
        this.props.onShowMap(this.state.selected);
    }

    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const {isLoad} = this.props;
        const {selected} = this.state;

        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button
                        className="sat-list-btn"
                        size="large"
                        type="primary"
                        disabled={selected.length === 0}
                        onClick={this.onShowSatMap}
                    >Track on the map</Button>
                </div>
                <hr/>
                {
                    isLoad ?
                        <div className="spin-box">
                            <Spin tip="Loading..." size="large"/>
                        </div>
                        :
                        <List
                            className="sat-list"
                            itemLayout="horizontal"
                            size="small"
                            dataSource={satList}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Checkbox dataInfo={item} onChange={this.onChange}/>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size={50} src={satellite}/>}
                                        title={<p>{item.satname}</p>}
                                        description={`Launch Date: ${item.launchDate}`}
                                    />
                                </List.Item>
                            )}
                        />
                }
            </div>
        );
    }
}

export default SatelliteList;