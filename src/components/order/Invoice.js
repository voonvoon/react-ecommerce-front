import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";

const Invoice = ({ order }) => (
  <Document>
    <Page style={styles.body} size="A4">
      <Text style={styles.header} fixed>
        ~ {new Date().toLocaleString()} ~
      </Text>
      <Text style={styles.title}>Order Invoice</Text>
      <Text style={styles.author}>React Redux Eccommerce</Text>
      <Text style={styles.subtitle}>Order Summary</Text>

      <Table>
        <TableHeader textAlign={"center"}>
          <TableCell weighting={1.3} >Title</TableCell>
          <TableCell weighting={0.5}>Price</TableCell>
          <TableCell weighting={0.5}>Quantity</TableCell>
          <TableCell weighting={0.5}>Brand</TableCell>
          <TableCell weighting={0.5}>Color</TableCell>
        </TableHeader>
      </Table>

      <Table data={order.products}>
        <TableBody textAlign={"center"}>
          <DataTableCell weighting={1.3} getContent={(x) => x.product.title} />
          <DataTableCell weighting={0.5} getContent={(x) => `$${x.product.price}`} />
          <DataTableCell weighting={0.5} getContent={(x) => x.count} />
          <DataTableCell weighting={0.5} getContent={(x) => x.product.brand} />
          <DataTableCell weighting={0.5} getContent={(x) => x.product.color} />
        </TableBody>
      </Table>

      <Text style={styles.text}>
        <Text>
          Date: {"               "}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </Text>
        {"\n"}
        <Text>
          Order Id:{"         "} {order.paymentIntent.id}
        </Text>
        {"\n"}
        <Text>
          Order Status: {"  "} {order.orderStatus}
        </Text>
        {"\n"}
        <Text>
          Total Paid:{"       "} ${order.paymentIntent.amount}
        </Text>
        {"\n"}
      </Text>

      <Text style={styles.footer}>~ Thank you for shopping with us! ~</Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export default Invoice;
