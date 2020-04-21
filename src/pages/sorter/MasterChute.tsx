import React, {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import Http from '../../api';
import './MasterChute.scss';

export enum ChuteType {
    NORMAL="NORMAL",
    REJECT="REJECT",
    OVERFLOW="OVERFLOW"
}
enum ChuteStatus {
    NORMAL="NORMAL",
    OVERFLOW="OVERFLOW",
    BLOCKED="BLOCKED"
}

interface MasterChute {
    no:number,
    name:string
    type:ChuteType,
    status:ChuteStatus
}


function MasterChute() {

    const [currentChute, setCurrentChute] = useState<MasterChute>();
    const [chutes, setChutes] = useState<Array<MasterChute>>();

    useEffect(()=>{
        GetChuteMaster();
    }, []);


    const GetChuteMaster = () => {
        return Http.get("/sorter/master/chute").then((res)=>{
            let chutes:Array<MasterChute> = res.data as Array<MasterChute>;
            setChutes(chutes);
        }).catch((err)=>{
            console.log(err)
        });
    }


    const OnChuteSelect = (i: MasterChute) => {
        setCurrentChute(i);
    }

    const OnChuteTypeChange = (e:ChangeEvent<HTMLSelectElement>) => {
        let s:ChuteType = e.target.value.toString() as ChuteType;
        if(currentChute !== undefined)
            setCurrentChute({...currentChute, type:s});
    }
    const OnChuteStatusChange = (e:ChangeEvent<HTMLSelectElement>) => {
        let s:ChuteStatus = e.target.value.toString() as ChuteStatus;
        if(currentChute !== undefined)
            setCurrentChute({...currentChute, status:s});
    }

    const OnChuteStatusSave = (e:MouseEvent<HTMLButtonElement>) => {
        if(currentChute !== undefined){
            Http.patch("/sorter/master/chute/"+currentChute.no, currentChute)
                .then((res)=>{
                    setCurrentChute(undefined);
                    GetChuteMaster();
                })
                .catch((err)=>{
                    console.error(err)
                });
        }
    }

    return (
        <div className="master-chute">
            <div>MasterChute</div>
            <div>
                <ul>
                {
                    chutes?.map(i=>{
                        return <li key={i.no} onClick={()=> OnChuteSelect(i)}>
                            <div className={"chute-type ".concat(i.type)}>
                                {i.type === ChuteType.NORMAL? i.no:i.type}
                            </div>
                            <div className={"chute-status ".concat(i.status)}>{i.status}</div>
                            </li>;
                    })
                }
                </ul>
            </div>
            {
                currentChute !== undefined? <div className={"chute-edit-container ".concat(currentChute?.type !== ChuteType.NORMAL? currentChute?.type:"")}>
                    <div>
                        <p>슈트번호</p>
                        <p>{currentChute.no}</p>
                    </div>
                    <div>
                        <p>슈트유형</p>
                        <select value={currentChute.type} onChange={OnChuteTypeChange}>
                            {
                                Object.keys(ChuteType)
                                    .map(i=>{
                                        return <option key={i}>{i}</option>
                                    })
                            }
                        </select>
                    </div>
                    <div>
                        <p>슈트상태</p>
                        <select value={currentChute.status} onChange={OnChuteStatusChange}>
                            {
                                Object.keys(ChuteStatus)
                                    .filter(i=> isNaN(Number(i)) === true)
                                    .map(i=> {
                                        return <option key={i}>{i}</option>;
                                    })
                            }
                        </select>
                    </div>

                    <div>
                        <button onClick={OnChuteStatusSave}>저장</button>
                        <button onClick={()=> setCurrentChute(undefined)}>취소</button>
                    </div>
                </div>:""
            }

        </div>
    );
}

export default MasterChute;