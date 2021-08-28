export const queryFetch = (graphQuery) => {
  return fetch("https://graph-student-mjahmed.herokuapp.com/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `${graphQuery}`,
    }),
  }).then((res) => res.json());
};

export const fetchAllStudents = (setStudents) => {
  queryFetch(`query{
        getAllStudent{
          id
          name
          email
          phone
          dateOfBirth
          takenSubjects{
            value
            label
          }
        }
        }`).then((data) => setStudents(data.data.getAllStudent));
};

export const saveNewStudent = (values, fetchAllStudents, setStudents) => {
  const stringifySubject = values.takenSubjects.map(
    (item) => `{value:"${item.value}", label:"${item.label}"},`
  );
  queryFetch(`
    mutation{
        createStudent(student:{ name: "${values.studentName}"
          email: "${values.email}",phone:"${values.phone}", dateOfBirth:"${values.dateOfBirth}",
          takenSubjects:[${stringifySubject}]}){
         name
          takenSubjects{
            label
          }
        }
      }
      `).then((data) => fetchAllStudents(setStudents));
};

export const deleteSingleStudent = (
  studentId,
  fetchAllStudents,
  setStudents
) => {
  queryFetch(`
      mutation{
        deleteStudent(id:"${studentId}")
      }
      `).then((data) => {
    fetchAllStudents(setStudents);
  });
};

export const getSubjectSummaryCount = (students, setSubjectCount) => {
  const counts = {};
  const temp = [];
  students.map((item) =>
    item.takenSubjects.forEach((sub) => temp.push(sub.label))
  );
  temp.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  // return counts;
  const result = {
    subName: Object.keys(counts),
    subCount: Object.values(counts),
  };
  // console.log(result)
  setSubjectCount(result);
};

export const updateSingleStudent = (
  values,
  fetchAllStudents,
  setStudents,
  onHide
) => {
  const stringifySubject = values.takenSubjects.map(
    (item) => `{value:"${item.value}", label:"${item.label}"},`
  );
  queryFetch(`
    mutation{
      updateStudent(id:"${values.id}",student:{
            name:"${values.name}",
            email: "${values.email}",
            phone: "${values.phone}",
            dateOfBirth: "${values.dateOfBirth}",
            takenSubjects: [${stringifySubject}]
          })
      {
        name
        takenSubjects{
          value
          label
        }
      }
    }
    `).then((data) => {
    console.log(data);
    fetchAllStudents(setStudents);
    onHide();
  });
};

export const createSubject = (values,subjectOptions,fetchAllSubject ,setSubjectOptions) => {
  queryFetch(`
  mutation{
      createSubject(subject: {
        value: "${subjectOptions.length + 1}",
        label: "${values.label}"
      }){
        label
      }
    }
  `).then((data) => fetchAllSubject(setSubjectOptions));
};
export const  fetchAllSubject =(setSubjectOptions)=>{
  queryFetch(`query{
    getAllSubjects{
      id
      value
      label
    }
  }`).then((data) => setSubjectOptions(data.data.getAllSubjects));
}
export const deleteSubject = (subjectId,fetchAllSubject ,setSubjectOptions) => {
  queryFetch(`
        mutation{
          deleteSubject(id:"${subjectId}")
        }
        `).then((data) => fetchAllSubject(setSubjectOptions));
};
