(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{211:function(e,t,a){"use strict";(function(e){var n,r=a(17),i=a.n(r),c=a(49),s=a(39),o=a(74),l=a(70),u=a(73),m=a(32),d=a(60),h=a(0),p=a.n(h),f=a(152),b=a(224),g=a(121),E=a(412),v=a(225),w=a(7),x=a(64),y=a(212),C=a(213),k=a(46),O=/^([^.]{3,6}\.[^.]+|[^.]{3,6}eth\.[^.]+|[^.]{1,4}\.[^.]{2}|[^.]{1,3}\.[^.]{3}|[^.]{1,2}\.[^.]{4}|[^.]{1}\.[^.]{5})$/,S="https://cloudflare-dns.com/dns-query?ct=application/dns-udpwireformat&dns=";function N(e,t){return j.apply(this,arguments)}function j(){return(j=Object(m.a)(i.a.mark(function e(t,a){var n;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={type:"query",id:Date.now()%65536,flags:x.RECURSION_DESIRED,questions:[{type:t,class:"IN",name:a}],answers:[],authorities:[],additionals:[]},e.next=3,T(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function T(e){return D.apply(this,arguments)}function D(){return(D=Object(m.a)(i.a.mark(function t(a){var n,r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(S+Object(x.encode)(a).toString("base64"));case 2:return n=t.sent,t.t0=x.decode,t.t1=e,t.next=7,n.arrayBuffer();case 7:return t.t2=t.sent,t.t3=new t.t1(t.t2),r=(0,t.t0)(t.t3),t.abrupt("return",r);case 11:case"end":return t.stop()}},t)}))).apply(this,arguments)}!function(e){e[e.Initial=1]="Initial",e[e.Loading=2]="Loading",e[e.Loaded=3]="Loaded"}(n||(n={}));var I=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(l.a)(t).call(this,e))).claimer=void 0,a.handleChange=function(e){a.setState({name:e.target.value,status:n.Initial})},a.handleCheck=function(e){return a.doCheck()},a.doCheck=Object(m.a)(i.a.mark(function e(){var t;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a.claimer){e.next=2;break}return e.abrupt("return");case 2:return a.setState({status:n.Loading}),e.next=5,N("TXT","_ens."+a.state.name);case 5:t=e.sent,a.setState({status:n.Loaded,result:t});case 7:case"end":return e.stop()}},e)})),a.handleClear=function(){var e=Object(m.a)(i.a.mark(function e(t){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a.setState({status:n.Initial,name:""});case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.state={name:"",status:n.Initial},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=Object(m.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.claimer=new d.ethers.Contract(this.props.address,y.a,this.context.provider);case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props.classes,a=this.state,r=a.name,i=a.status,c=a.result;return p.a.createElement(g.a,{container:!0,spacing:3},p.a.createElement(g.a,{item:!0,xs:9},p.a.createElement(E.a,{autoFocus:!0,label:"DNS domain",className:t.textField,value:r,onKeyPress:function(t){return"Enter"===t.key&&e.doCheck()},onChange:this.handleChange})),p.a.createElement(g.a,{item:!0,xs:3},p.a.createElement(f.a,{variant:"contained",color:"primary",className:t.button,onClick:this.handleCheck,disabled:!O.test(r)},"Check"),p.a.createElement(f.a,{variant:"contained",color:"default",className:t.button,onClick:this.handleClear},"Clear")),i===n.Loading&&p.a.createElement(g.a,{item:!0,xs:12},p.a.createElement(b.a,{className:t.progress})),i===n.Loaded&&c&&this.claimer&&p.a.createElement(C.a,{name:r,claimer:this.claimer,result:c}))}}]),t}(p.a.Component);I.contextType=k.a,t.a=Object(w.a)(function(e){return Object(v.a)({textField:{marginLeft:e.spacing(1),marginRight:e.spacing(1),width:"100%"},button:{margin:e.spacing(1),width:"40%"},progress:{margin:e.spacing(2)}})})(I)}).call(this,a(14).Buffer)},213:function(e,t,a){"use strict";var n=a(17),r=a.n(n),i=a(32),c=a(49),s=a(39),o=a(74),l=a(70),u=a(73),m=a(64),d=a.n(m),h=a(60),p=a(144),f=a(0),b=a.n(f),g=a(152),E=a(224),v=a(410),w=a(408),x=a(150),y=a(93),C=a(151),k=a(413),O=a(120),S=a.n(O),N=a(91),j=a.n(N),T=a(225),D=a(7),I=a(214),A=a(46),$=/^a=(0x[0-9a-fA-F]{40})$/,L=[{re:/^([^.]{3,6})\.[^.]+$/,method:"submitExactClaim"},{re:/^([^.]{3,6})eth\.[^.]+$/,method:"submitPrefixClaim"},{re:/^([^.]{1,4})\.([^.]{2})$/,method:"submitCombinedClaim"},{re:/^([^.]{1,3})\.([^.]{3})$/,method:"submitCombinedClaim"},{re:/^([^.]{1,2})\.([^.]{4})$/,method:"submitCombinedClaim"},{re:/^([^.])\.([^.]{5})$/,method:"submitCombinedClaim"}],P=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(l.a)(t).call(this,e))).getClaimantAddress=function(){var e=!0,t=!1,n=void 0;try{for(var r,i=a.props.result.answers[Symbol.iterator]();!(e=(r=i.next()).done);e=!0){var c=r.value;if("TXT"===c.type){var s=!0,o=!1,l=void 0;try{for(var u,m=c.data[Symbol.iterator]();!(s=(u=m.next()).done);s=!0){var d=u.value.toString().match($);if(d)return d[1]}}catch(h){o=!0,l=h}finally{try{s||null==m.return||m.return()}finally{if(o)throw l}}}}}catch(h){t=!0,n=h}finally{try{e||null==i.return||i.return()}finally{if(t)throw n}}return null},a.fetchClaims=Object(i.a)(r.a.mark(function e(){var t,n,c,s,o,l,u,m,f;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.props,n=t.claimer,c=t.name,e.next=3,n.priceOracle();case 3:return s=e.sent,o=new h.ethers.Contract(s,I.a,a.context.provider),e.next=7,n.REGISTRATION_PERIOD();case 7:return l=e.sent,u=a.getClaimantAddress(),m="0x"+d.a.name.encode(c).toString("hex"),e.next=12,Promise.all(L.map(function(){var e=Object(i.a)(r.a.mark(function e(t){var a,i,s,d,h;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=c.match(t.re)){e.next=3;break}return e.abrupt("return",void 0);case 3:return i=a.slice(1).join(""),e.t0=p.bigNumberify,e.next=7,o.price(i,0,l);case 7:return e.t1=e.sent,s=(0,e.t0)(e.t1),e.next=11,n.computeClaimId(i,m,u);case 11:return d=e.sent,e.next=14,n.claims(d);case 14:return h=e.sent,e.abrupt("return",{claimed:i,cost:s,method:t.method,submitted:!Object(p.bigNumberify)(h[2]).isZero()});case 16:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 12:e.t0=function(e){return void 0!==e},f=e.sent.filter(e.t0),a.setState({claims:f});case 15:case"end":return e.stop()}},e)})),a.claimName=function(e){return Object(i.a)(r.a.mark(function t(){var n,i,c,s,o,l,u,m,h;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a.context.account();case 2:return n=a.props,i=n.claimer,c=n.name,s=i.connect(a.context.provider.getSigner()),o="0x"+d.a.name.encode(c).toString("hex"),l=a.getClaimantAddress(),u=e.cost.add(e.cost.div(10)),t.next=9,s[e.method](o,l,{value:u});case 9:return m=t.sent,h=m.hash.slice(0,6)+"\u2026"+m.hash.slice(62),a.setState({message:"Transaction "+h+" submitted"}),t.next=14,m.wait();case 14:return a.setState({message:"Transaction "+h+" mined!"}),t.next=17,a.fetchClaims();case 17:case"end":return t.stop()}},t)}))},a.handleClose=function(){a.setState({message:void 0})},a.state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=Object(i.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetchClaims();case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props,a=t.name,n=t.result,r=t.classes,i=this.state,c=i.claims,s=i.message,o="NOERROR"===n.rcode&&n.answers.length>0,l=!1;return o&&(l=null!=this.getClaimantAddress()),b.a.createElement(b.a.Fragment,null,b.a.createElement(w.a,{component:"ul"},b.a.createElement(x.a,null,o?b.a.createElement(y.a,null,b.a.createElement(S.a,null)):b.a.createElement(y.a,null,b.a.createElement(j.a,null)),b.a.createElement(C.a,{primary:"Text record on _ens."+a,secondary:o?"":"You must publish a TXT record on _ens."+a+", in the format 'a=0x...', specifying the address you want to own the ENS name."})),b.a.createElement(x.a,null,l?b.a.createElement(y.a,null,b.a.createElement(S.a,null)):b.a.createElement(y.a,null,b.a.createElement(j.a,null)),b.a.createElement(C.a,null,"Text record in correct format (`a=0x...`)")),c?"":b.a.createElement(E.a,{className:r.progress}),c&&c.map(function(t){return b.a.createElement(x.a,{key:t.claimed},b.a.createElement(y.a,null,t.submitted?b.a.createElement(S.a,null):b.a.createElement(j.a,null)),b.a.createElement(C.a,null,"Claimed ",t.claimed,".eth for ",h.ethers.utils.formatEther(t.cost)," ETH",t.submitted?"":b.a.createElement(g.a,{variant:"contained",color:"primary",className:r.button,onClick:e.claimName(t),disabled:!l},"Claim")))})),b.a.createElement(k.a,{anchorOrigin:{vertical:"bottom",horizontal:"left"},open:void 0!==s,autoHideDuration:6e3,onClose:this.handleClose,message:s,action:[b.a.createElement(v.a,{key:"close","aria-label":"Close",color:"inherit",onClick:this.handleClose},b.a.createElement(j.a,null))]}))}}]),t}(b.a.Component);P.contextType=A.a,t.a=Object(D.a)(function(e){return Object(T.a)({button:{margin:e.spacing(1)},progress:{margin:e.spacing(2)}})})(P)},236:function(e,t,a){e.exports=a(407)},242:function(e,t,a){},252:function(e,t){},258:function(e,t){},260:function(e,t){},294:function(e,t){},405:function(e,t,a){},407:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(15),c=a.n(i),s=a(46);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(242);var o=a(17),l=a.n(o),u=a(32),m=a(49),d=a(39),h=a(74),p=a(70),f=a(73),b=a(119),g=a(224),E=a(465),v=a(463),w=a(454),x=a(94),y=a(225),C=a(7),k=a(117),O=a(211),S=a(92),N=a(217),j=a(145),T=a(218),D=a.n(T),I=a(456),A=a(414),$=a(458),L=a(462),P=a(461),R=a(464),q=a(459),F=a(467),_=a(460),B=a(457),H=a(146),M=a(223),W=a.n(M);function X(){var e=Object(N.a)(["\n  query Claims($search: String, $skip: Int, $limit: Int) {\n    claims(first: $limit, skip: $skip, orderBy: name, where: {name_starts_with: $search}) {\n      id\n      name\n      dnsName\n      owner\n      approved\n      submittedAt\n    }\n  }\n"]);return X=function(){return e},e}var z=Object(I.a)(function(e){return Object(y.a)({root:{width:"100%",marginTop:e.spacing(3),overflowX:"auto"},table:{minWidth:650},toolbar:{paddingLeft:e.spacing(2),paddingRight:e.spacing(1)},spacer:{flex:"1 1 100%"},title:{flex:"0 0 auto"},search:Object(j.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(H.fade)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(H.fade)(e.palette.common.white,.25)},marginLeft:0,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(1),width:"auto"}),searchIcon:{width:e.spacing(7),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit"},inputInput:Object(j.a)({padding:e.spacing(1,1,1,7),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("sm"),{width:120,"&:focus":{width:200}})})}),J=Object(b.b)(X()),U=function(e){var t=z(),a=e.exploreUrl,n=r.a.useState(0),i=Object(S.a)(n,2),c=i[0],s=i[1],o=r.a.useState(2),l=Object(S.a)(o,2),u=l[0],m=l[1],d=r.a.useState(""),h=Object(S.a)(d,2),p=h[0],f=h[1],b=r.a.useState(""),E=Object(S.a)(b,2),w=E[0],y=E[1];return y=D()(y,500),r.a.createElement(r.a.Fragment,null,r.a.createElement(B.a,{className:t.toolbar},r.a.createElement(x.a,{variant:"h6",className:t.title},"Claims"),r.a.createElement("div",{className:t.spacer}),r.a.createElement("div",{className:t.search},r.a.createElement("div",{className:t.searchIcon},r.a.createElement(W.a,null)),r.a.createElement(A.a,{placeholder:"Search",classes:{root:t.inputRoot,input:t.inputInput},onChange:function(e){f(e.target.value),y(e.target.value)},value:p}))),r.a.createElement(k.b,{query:J,variables:{search:w,limit:u,skip:c}},function(e){return e.loading?r.a.createElement(g.a,null):e.error?r.a.createElement("div",null,"Error loading list of claims."):r.a.createElement(r.a.Fragment,null,r.a.createElement($.a,{className:t.table},r.a.createElement(q.a,null,r.a.createElement(_.a,null,r.a.createElement(P.a,null,"Name"),r.a.createElement(P.a,null,"DNS Domain"),r.a.createElement(P.a,null,"Submitted"),r.a.createElement(P.a,null,"Account"))),r.a.createElement(L.a,null,e.data.claims.map(function(e){return r.a.createElement(_.a,{key:"{claim.name}:{claim.dnsName}:{claim.owner}"},r.a.createElement(P.a,null,e.name,".eth"),r.a.createElement(P.a,null,e.dnsName),r.a.createElement(P.a,null,new Date(1e3*e.submittedAt).toLocaleDateString()),r.a.createElement(P.a,null,r.a.createElement(v.a,{href:a+e.owner},e.owner.slice(0,6)+"\u2026"+e.owner.slice(38))))})),r.a.createElement(R.a,null,r.a.createElement(F.a,{rowsPerPageOptions:[5,10,25,50],rowsPerPage:u,page:c/u,count:e.data.claims.length===u?c+u+1:c+e.data.claims.length,onChangePage:function(e,t){return s(Math.max(u*t,0))},onChangeRowsPerPage:function(e){return m(parseInt(e.target.value))}}))))}))},G=(a(405),{3:{nameClaimAddress:"0x0b74a518f10d6daf90c0c1aeabec2ffe851ccfa5",graphql:"https://api.thegraph.com/subgraphs/name/ensdomains/shortnameclaims",etherscan:"https://ropsten.etherscan.io/address/"},1558996169577:{nameClaimAddress:"0xe982E462b094850F12AF94d21D470e21bE9D0E9C",etherscan:""}}),K=function(e){function t(e){var a;return Object(m.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={},a}return Object(f.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=Object(u.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=this,e.next=3,this.context.provider.getNetwork();case 3:e.t1=e.sent,e.t2={network:e.t1},e.t0.setState.call(e.t0,e.t2);case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props.classes,t=this.state.network;if(!t)return r.a.createElement(E.a,{maxWidth:"md"},r.a.createElement("h1",null,"ENS Short Name Claim Tool"),r.a.createElement(g.a,null));var a=t?G[t.chainId]:null;if(!a)return r.a.createElement(E.a,{maxWidth:"md"},r.a.createElement("h1",null,"ENS Short Name Claim Tool"),r.a.createElement(w.a,null,r.a.createElement(x.a,{variant:"h2",component:"h1"},"Network Not Supported"),r.a.createElement(x.a,{variant:"body1"},"The network your browser is connected to is not supported. Please connect to a supported network.")));var n=a.graphql?new b.a({uri:a.graphql}):null;return r.a.createElement(E.a,{maxWidth:"md",className:e.root},r.a.createElement("h1",null,"ENS Short Name Claim Tool"),n&&r.a.createElement(w.a,{className:e.paper},r.a.createElement(k.a,{client:n},r.a.createElement(U,{address:a.nameClaimAddress,exploreUrl:a.etherscan}))),r.a.createElement(w.a,{className:e.paper},r.a.createElement("h2",{className:e.h2},"Submit a claim"),r.a.createElement(O.a,{address:a.nameClaimAddress})),r.a.createElement(w.a,{className:e.paper},r.a.createElement("h2",{className:e.h2},"About"),r.a.createElement("p",null,r.a.createElement(v.a,{href:"https://ens.domains/"},"ENS")," is making names shorter than 7 characters available for registration in the near future. Before they become generally available for registration, there will be a preregistration period, during which existing DNS domain owners can request ownership of the equivalent ENS domain, followed by an auction. Once both preregistration and auction are completed, names will be opened for general registration."),r.a.createElement("p",null,"This app allows owners of existing DNS domains to participate in the preregistration process. Anyone who owns an existing DNS second-level domain (2LD) may submit a claim. Successful claims will allow the claimant to register the corresponding .eth domain without having to engage in the auction process."),r.a.createElement("p",null,"To qualify, the domain being used to support the claim must meet the following criteria:"),r.a.createElement("ol",null,r.a.createElement("li",null,"Must be a DNS second-level domain (2LD)"),r.a.createElement("li",null,"Must have been registered on or before January 1, 2019."),r.a.createElement("li",null,"Must have whois information available that includes the domain's initial registration date.")),r.a.createElement("p",null,"The ENS name being claimed must be one of:"),r.a.createElement("ol",null,r.a.createElement("li",null,"An exact match for the existing DNS domain (eg, foo.com -> foo.eth)"),r.a.createElement("li",null,"The DNS domain with the suffix 'eth' removed (eg, asseth.fr -> ass.eth)"),r.a.createElement("li",null,"The concatenation of domain and TLD (eg, foo.com -> foocom.eth)")),r.a.createElement("p",null,"Domains being claimed must be 3-6 characters long."),r.a.createElement("p",null,"Each application must be accompanied by the fee for a year's registration ($5 in ETH for a 5-6 character name, $160 in ETH for a 4 character name, and $640 in ETH for a 3 character name). If an application is successful, the claimant is issued the name with 365 days' registration period (this can be extended as desired). If an application is unsuccessful, the fee will be returned to the claimant."),r.a.createElement("p",null,"In the event that multiple claims are submitted for the same ENS name, the name will be issued to the claimant whose DNS domain was registered the earliest, based on available whois data."),r.a.createElement("p",null,"All claims are decided based on the sole discretion of the ENS team. Decisions are final."),r.a.createElement("h3",null,"Submission Process"),r.a.createElement("ol",null,r.a.createElement("li",null,"Publish a TXT record on the '_ens' subdomain (eg, _ens.yourdomain.tld). The TXT record must be in the format 'a=0x...'. The address provided in this TXT record is the address of the claimant, who will have control of the domain if the application is successful, and who will receive a refund if it is not."),r.a.createElement("li",null,"Enter your domain name (eg, yourdomain.tld) in the 'Submit a Claim' section on this page and click 'Check'."),r.a.createElement("li",null,"If all the checks pass, choose the name you wish to claim and click 'submit'."),r.a.createElement("li",null,"Approve the transaction request, for a year's registration fee plus gas costs for proving ownership of your domain."))))}}]),t}(r.a.Component);K.contextType=s.a;var Y=Object(C.a)(function(e){return Object(y.a)({root:{},paper:{marginBottom:e.spacing(3),padding:e.spacing(3),"& p":{fontSize:"14pt",lineHeight:"1.5em"},"& li":{fontSize:"14pt",lineHeight:"1.5em"}},h2:{marginTop:0}})})(K);c.a.render(r.a.createElement(s.a.Provider,{value:s.b},r.a.createElement(Y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},46:function(e,t,a){"use strict";a.d(t,"b",function(){return m}),a.d(t,"a",function(){return d});var n=a(17),r=a.n(n),i=a(32),c=a(49),s=a(39),o=a(60),l=a(0),u=a.n(l),m=new(function(){function e(t){Object(c.a)(this,e),this.provider=void 0,this.provider=t}return Object(s.a)(e,[{key:"account",value:function(){var e=Object(i.a)(r.a.mark(function e(){var t;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ethereum.enable();case 2:if(void 0!==(t=e.sent)&&null!==t){e.next=5;break}return e.abrupt("return",t);case 5:return e.abrupt("return",t[0]);case 6:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()}]),e}())(new o.ethers.providers.Web3Provider(ethereum)),d=u.a.createContext(m)}},[[236,1,2]]]);
//# sourceMappingURL=main.cafe4ec2.chunk.js.map