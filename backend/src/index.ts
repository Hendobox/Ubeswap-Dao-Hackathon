import path from 'path';
import cors from 'cors';
import morgan from "morgan";
import { express, router } from './routes/api';
const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors()
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use('/v1', router);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});