import React from "react";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import moment from "moment";
import { useContainedCardHeaderStyles } from "@mui-treasury/styles/cardHeader/contained";
import { useSoftRiseShadowStyles } from "@mui-treasury/styles/shadow/softRise";
import { useFadedShadowStyles } from "@mui-treasury/styles/shadow/faded";
import { useBlogTextInfoContentStyles } from "@mui-treasury/styles/textInfoContent/blog";
import { useOverShadowStyles } from "@mui-treasury/styles/shadow/over";
import { useGraphicBtnStyles } from "@mui-treasury/styles/button/graphic";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    marginTop: 40,
    borderRadius: spacing(0.5),
    transition: "0.3s",
    width: "90%",
    overflow: "initial",
    background: "#ffffff",
  },
  content: {
    paddingTop: 0,
    textAlign: "left",
    overflowX: "auto",
    "& table": {
      marginBottom: 0,
    },
  },
  join: {
    background: "linear-gradient(to top, #638ef0, #82e7fe)",
    marginRight: "20px",
    "& > *": {
      textTransform: "none !important",
    },
  },
}));

let id = 0;
function createData(name, fat, price) {
  id += 1;
  return { id, name, fat, price };
}

export const StudentList = React.memo(function ElevatedHeaderCard({
  students,
  propsObj,
}) {
  const {
    fetchAllStudents,
    setStudents,
    deleteSingleStudent,
    setModalShow,
    setModalData,
  } = propsObj;
  const classes = useStyles();
  const btnStyles = useGraphicBtnStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();
  const { button: buttonStyles, ...contentStyles } =
    useBlogTextInfoContentStyles();
  const shadowStyles = useOverShadowStyles();
  return (
    <Card className={cx(classes.card, cardShadowStyles.root)}>
      <CardHeader
        className={cardHeaderShadowStyles.root}
        classes={cardHeaderStyles}
        title={"Student List"}
        subheader={"List of students with Subjects"}
      />
      <CardContent className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">SL</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Date of Birth</TableCell>
              <TableCell align="right">Subjects Taken</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{item.name}</TableCell>
                <TableCell align="right">{item.email}</TableCell>
                <TableCell align="right">{item.phone}</TableCell>
                <TableCell align="right">
                  {moment(item.dateOfBirth).format("MMM Do YY")}
                </TableCell>
                <TableCell align="right">
                  {item.takenSubjects.map((sub) => `- ${sub.label} `)}
                </TableCell>
                <TableCell align="right">{item.fat}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">
                  <Button
                    className={classes.join}
                    classes={btnStyles}
                    variant={"contained"}
                    color={"primary"}
                    disableRipple
                    onClick={() => {
                      setModalShow(true);
                      setModalData(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className={buttonStyles}
                    onClick={() =>
                      deleteSingleStudent(
                        item.id,
                        fetchAllStudents,
                        setStudents
                      )
                    }
                  >
                    Delete
                  </Button>
                  {/* <button
                    onClick={() => {
                      setModalShow(true);
                      setModalData(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteSingleStudent(
                        item.id,
                        fetchAllStudents,
                        setStudents
                      )
                    }
                  >
                    Delete
                  </button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

export default StudentList;
