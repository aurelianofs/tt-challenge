import Layout from "components/layout/Layout";

export default function PageWrapper({ title = '', children }) {
  return (
    <Layout>
      { title ? <h1 className="text-3xl mb-5">{title}</h1> : null }
      { children }
    </Layout>
  )
}
