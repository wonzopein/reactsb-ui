import React, {MouseEvent, useEffect, useState} from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import Http from "../../api";

enum EquipmentType {
    PLC="PLC",
    BCR="BCR"
}

interface EquipmentPort{
    id:string,
    port:number,
    run:boolean,
    runDateTime:Date,
    stopDateTime:Date
}

interface Equipment {
    id:string,
    name:string
    ports:Array<EquipmentPort>,
    type:EquipmentType
}



function Sorter() {

    let {path, url} = useRouteMatch();

    const [sendMessage, setSendMessage] = useState("");
    const [equipments, setEquipments] = useState<Array<Equipment>>();

    const [isRemoteWorking, setRemoteWoring] = useState<boolean>(false);

    const GetEquipments = () => {
        Http.get("/tcp/equipment")
            .then((res)=> {
                console.log(res);
                setEquipments(res.data as Array<Equipment>);
            })
            .catch((err)=>console.error(err));
    }

    useEffect(()=>{
        GetEquipments();
    },[]);

    const ControlPort = (i: Equipment, p: EquipmentPort, b: boolean) => {
        Http.post("/tcp/equipment/"+ i.id + (b? "/run":"/stop") + "/port/" + p.id)
            .then((res)=>{
                let result : boolean = res.data as boolean;
                if(result) {
                    p.run = b;
                    i.ports = i.ports.map(i1 => i1.id === p.id? p:i1 );

                    let eqs = equipments?.map(e => e.id === i.id? i:e);
                    setEquipments(eqs);
                }
            })
            .catch((err)=>{
                console.error(err)
            });
    }

    const SendMessage = (i: Equipment, p: EquipmentPort) => {
        if(sendMessage.trim().length == 0)
            return;

        setRemoteWoring(true);

        setTimeout(()=> {
            Http.post("/tcp/equipment/" + p.id + "/send", {message:sendMessage})
                .then((res)=>{
                    console.log(res)
                    let result : boolean = res.data as boolean;
                    if(result){
                        setSendMessage("");
                    }
                })
                .catch((err)=>{
                    console.log(err)
                }).finally(()=>{
                setRemoteWoring(false);
            });
        }, 1000);

    }

    return (
        <div>
            {/*<div>*/}
            {/*    <div>*/}
            {/*        <p>PLC</p>*/}
            {/*        <ul>*/}
            {/*            <li><Link to={`${url}/master/chute`}>슈트 마스터</Link></li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}

            {/*    <div>*/}
            {/*        <p>BCR</p>*/}
            {/*        <ul>*/}
            {/*            <li><Link to={`${url}/order/orders`}>슈트 오더</Link></li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}

            {/*</div>*/}

            <div>
                <ul>
                    {
                        equipments?.map(i=>{
                            return <li key={i.id}>
                                <div>
                                    {i.name}
                                </div>
                                {/*<div>*/}
                                {/*    <p>aaa = {i.run.toString()}</p>*/}
                                {/*</div>*/}
                                <ul>
                                    {
                                        i.ports.map(p => {
                                            return <li key={p.id}>
                                                <div>
                                                    <span>{p.id}</span>
                                                    <span>({p.port})</span>
                                                    <button onClick={() => ControlPort(i, p, true)} disabled={p.run}>Run</button>
                                                    <button onClick={() => ControlPort(i, p, false)} disabled={!p.run}>Stop</button>
                                                    <div>
                                                        <input type="text" value={sendMessage} width={200} onChange={(e => setSendMessage(e.target.value))} disabled={!p.run || isRemoteWorking}/>
                                                        <button onClick={()=>SendMessage(i,p)} disabled={!p.run || isRemoteWorking}>보내기</button>
                                                    </div>
                                                </div>
                                            </li>
                                        })
                                    }
                                </ul>
                                <div>
                                    {/*<button onClick={()=> ControlEquipment(i, true)} disabled={i.run}>Run</button>*/}
                                    {/*<button onClick={()=> ControlEquipment(i, false)} disabled={!i.run}>Stop</button>*/}
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>



            <Switch>
                <Route exact path={path}>
                    is equipment
                </Route>
                {/*<Route path={`${path}/master/chute`} component={MasterChute} />*/}
                {/*<Route path={`${path}/order/orders`} component={OrderChute} />*/}
                {/*<Route path={`${path}/order/proc`} component={OrderProc} />*/}
            </Switch>
        </div>
    );
}

export default Sorter;