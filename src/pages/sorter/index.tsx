import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import MasterChute from "./MasterChute";
import OrderChute from "./OrderChute";
import OrderProc from "./OrderProc";

function Sorter() {

    let {path, url} = useRouteMatch();

    return (
        <div>
            <div>
                <div>
                    <p>마스터</p>
                    <ul>
                        <li><Link to={`${url}/master/chute`}>슈트 마스터</Link></li>
                    </ul>
                </div>

                <div>
                    <p>오더</p>
                    <ul>
                        <li><Link to={`${url}/order/orders`}>슈트 오더</Link></li>
                        <li><Link to={`${url}/order/proc`}>분류 진행정보</Link></li>
                    </ul>
                </div>

            </div>

            <Switch>
                <Route exact path={path}>
                    is main
                </Route>
                <Route path={`${path}/master/chute`} component={MasterChute} />
                <Route path={`${path}/order/orders`} component={OrderChute} />
                <Route path={`${path}/order/proc`} component={OrderProc} />
            </Switch>
        </div>
    );
}

export default Sorter;