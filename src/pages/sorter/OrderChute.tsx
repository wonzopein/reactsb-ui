import React, {useEffect, useState} from "react";
import Http from "../../api";
import MasterChute from "./MasterChute";
import './OrderChute.scss';
import {ChuteType} from "./MasterChute";

interface OrderChute {
    no:number,
    qty:number
}

interface OrderChuteGroup {
    id:OrderId,
    count:number
}

interface OrderId {
    no:number,
    code:string
}

function OrderChute() {

    const [chutes, setChutes] = useState<Array<OrderChute>>();
    const [chutesOrders, setChuteOrders] = useState<Array<OrderChuteGroup>>();

    const GetChuteOrder = () => {
        return Http.get("/sorter/order/chute")
            .then((res)=>{
                let chutes:Array<OrderChute> = (res.data as Array<OrderChute>);
                setChutes(chutes);
            })
            .catch((err) => {
                console.error(err);
            })
    };


    const OnSelecteChute = (chute: OrderChute) => {

        Http.get("/sorter/order/chute/"+chute.no)
            .then((res) => {
                setChuteOrders(res.data as Array<OrderChuteGroup>);
            })
            .catch((err)=>{
                console.error(err)
            });

    }

    useEffect(()=>{
        GetChuteOrder();
    }, []);

    return (
        <div className="order-chute">
            <div>OrderChute</div>
            <div className="order-chute-items">
                <div className="order-chute">
                    <ul>
                        {
                            chutes?.map(i=>{
                                return <li key={i.no} onClick={()=>OnSelecteChute(i)}>{i.no} 번 <span>{i.qty}</span></li>;
                            })
                        }
                    </ul>
                </div>
                <div className="order-items">
                    <ul>
                        {
                            chutesOrders?.map(i=>{
                                return <li key={i.id.code}>{i.id.no} , {i.id.code}, {i.count}</li>
                            })
                        }
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default OrderChute;