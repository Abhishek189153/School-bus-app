import {
AppBar,
Toolbar,
Typography,
Avatar,
Box,
IconButton,
Badge,
TextField,
} from "@mui/material";

import NotificationsIcon
from "@mui/icons-material/Notifications";

export default function Header(){

return(

<AppBar

position="sticky"

elevation={0}

sx={{
background:"#fff",
color:"#111827",
borderBottom:"1px solid #EEF2F7"
}}

>

<Toolbar>

<TextField

size="small"

placeholder="Search..."

sx={{
width:320,
background:"#F5F7FB",
borderRadius:2
}}

/>

<Box flexGrow={1}/>

<IconButton>

<Badge
badgeContent={3}
color="error"
>

<NotificationsIcon/>

</Badge>

</IconButton>

<Avatar
sx={{
ml:3,
bgcolor:"#2563EB"
}}
>
S
</Avatar>

</Toolbar>

</AppBar>

)

}