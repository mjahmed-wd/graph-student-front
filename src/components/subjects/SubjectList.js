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
import { useContainedCardHeaderStyles } from "@mui-treasury/styles/cardHeader/contained";
import { useSoftRiseShadowStyles } from "@mui-treasury/styles/shadow/softRise";
import { useFadedShadowStyles } from "@mui-treasury/styles/shadow/faded";
import { useBlogTextInfoContentStyles } from "@mui-treasury/styles/textInfoContent/blog";
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

export const SubjectList = React.memo(function ElevatedHeaderCard({
  subjectOptions,
  objProps,
}) {
  const { deleteSubject, fetchAllSubject, setSubjectOptions } = objProps;
  const classes = useStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();
  const { button: buttonStyles } = useBlogTextInfoContentStyles();
  return (
    <div className="d-flex justify-content-center">
      <div className="w-25">
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
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectOptions.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">{item.label}</TableCell>
                    <TableCell align="right">
                      <Button
                        className={buttonStyles}
                        onClick={() =>
                          deleteSubject(
                            item.id,
                            fetchAllSubject,
                            setSubjectOptions
                          )
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SubjectList;
