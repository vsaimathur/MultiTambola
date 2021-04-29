import { Typography, ListItem, List, ListItemText } from "@material-ui/core";

const rootStyles = {
    minHeight: "100%",
    display: "grid",
    gridTemplateRows: "10% auto",
}

const Rules = () => {
    return (
        <div style={rootStyles}>
            <Typography variant="h4" align="center" color="secondary" className="text-uppercase mt-4">Rules</Typography>
            <List>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">Tambola is played on a basic principle. The organizer/caller calls the Numbers (1-90) one at a time Randomly and the players need to strike Numbers on their tickets.</Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography variant="h4" className="font-weight-bold">Steps to Play :</Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary="1. Organizer/ Host can create a game using Create Room Button in play Tab and Room will be Created."></ListItemText></ListItem>
                <ListItem button><ListItemText primary="2. All the players can join the room created by Host using JoinRoom Button"></ListItemText></ListItem>
                <ListItem button><ListItemText primary="3. After filling necessary information like no. of Tickets, Name, We proceed to Game Screen"></ListItemText></ListItem>
                <ListItem button><ListItemText primary="4. In the Game Screen, there will be 5 things."></ListItemText></ListItem>
                <ListItem button><ListItemText primary="A. Firstly, A generate button which generates Random Number on Click and a Switch which generates Random Numbers automatically. These Buttons are only visible to Host!. The generated numbers will be visible to all the players and players can mark it."></ListItemText></ListItem>
                <ListItem button><ListItemText primary="B. Secondly, A Participants Button, which on Clicking will show all the players in the game!"></ListItemText></ListItem>
                <ListItem button><ListItemText disableTypography primary={<Typography className="font-weight-bold">C. Thirdly, A Show Board button which shows the live status of Board, It's available for a Cost of<Typography className="text-warning" display="inline">5$</Typography>, Think before Pressing it."</Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary="D. Fourthly, Tickets for playing game according to the no. of Tickets requested by players."></ListItemText></ListItem>
                <ListItem button><ListItemText primary="E. Fifthly, Winning Points For the Game!, There are 5 Winning Points like:"></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">I. Early Five : The Ticket with first five struck numbers <Typography className="text-warning" display="inline">5$</Typography></Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">II. First Row/Top Row: The Ticket with all numbers struck in a top row first <Typography className="text-warning" display="inline">5$</Typography></Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">III. Second Row/Middle Row: The Ticket with all numbers struck in a middle row first <Typography className="text-warning" display="inline">5$</Typography></Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">IV. Third Row/Bottom Row: The Ticket with all numbers struck in a bottom row first <Typography className="text-warning" display="inline">5$</Typography></Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">V. Full House/First House: The Ticket with all its numbers struck first <Typography className="text-warning" display="inline">25$</Typography></Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">5. If you think you completed the winning point condition, click on button corresponding to it. You'll have maximum of 3 trials for checking after that, button gets disabled.</Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">Total no. of <Typography className="text-warning" display="inline">$ points</Typography> you have will be displayed in Top-Right Corner</Typography>}></ListItemText></ListItem>
                <ListItem button><ListItemText primary={<Typography className="font-weight-bold">6. After Game Completion i.e after someone winning Full Housie, there will be a LeaderBoard of players sorted according to their respective points earned!.</Typography>}></ListItemText></ListItem>
            </List>
        </div>);
}

export default Rules;