import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Chart from 'layout/dashboard/main/Chart';
import Deposits from 'layout/dashboard/main/Deposits';
import Orders from 'layout/dashboard/main/Orders';

const useStyles = makeStyles((theme: Theme) => createStyles({

  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const MainDashboard = props => {
  const classes = useStyles(props);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Orders />
        </Paper>
      </Grid>
    </Grid>

  )
}

export default MainDashboard;
