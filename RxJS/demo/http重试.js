import { ajax } from "rxjs/ajax";
import { map, retry, catchError } from "rxjs/operators";
import { of } from "rxjs";

const apiData = ajax("/api/data").pipe(
  retry(3), // 失败前会重试最多3次
  map((res) => {
    if (!res.response) {
      throw new Error("Value expected");
    }
    return res.response;
  }),
  catchError((err) => of([]))
);

apiData.subscribe({
  next(x) {
    console.log("data:", x);
  },
  error(err) {
    console.log("errors already caught ... will not run");
  },
});
