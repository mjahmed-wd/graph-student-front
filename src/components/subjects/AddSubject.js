import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { queryFetch } from "../../helper/graphqlQuery";
const AddSubject = () => {
  const initData = {
    // value: "",
    label: "",
  };
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    //   subject query for options
    queryFetch(`query{
        getAllSubjects{
          id
          value
          label
        }
      }`).then((data) => setSubjectOptions(data.data.getAllSubjects));
  }, []);

const createSubject=(values)=>{
queryFetch(`
mutation{
    createSubject(subject: {
      value: "${subjectOptions.length+1}",
      label: "${values.label}"
    }){
      label
    }
  }
`).then(data=>console.log(data))
}
  const deleteSubject=(subjectId)=>{
      queryFetch(`
      mutation{
        deleteSubject(id:"${subjectId}")
      }
      `).then(data=>console.log(data))
  }
  return (
    <div>
      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          /* and other goodies */
        }) => (
          <Form>
            {/* <Field type="value" name="value" />
            <ErrorMessage name="value" component="div" /> */}
            <Field type="label" name="label" />
            <ErrorMessage name="label" component="div" />

            <button type="button" onClick={() => createSubject(values)}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {subjectOptions.length > 0 && (
        <table>
          <thead>
            <th>Subject Name</th>
            <th>Action</th>
          </thead>
          <tbody>
            {subjectOptions.map((item) => (
              <tr>
                <td>{item.label}</td>
                <td>
                  <button onClick={()=>deleteSubject(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddSubject;
