import { promises as fs } from 'fs';

const getData = async () => {
  const response = await fs.readFile("car-list.json", "utf-8")
  return JSON.parse(response);
}

const getBrandWithMostModels = async () => {
  let brand = ''
  let num = 0
  const data = await getData();
  data.forEach((car) => {
    if (car.models.length > num) {
      num = car.models.length
      brand = car.brand
    }
  });
  return brand;
}

const getBrandWithLessModels = async () => {
  let brand = ''
  let num = 100
  const data = await getData();
  data.forEach((car) => {
    if (car.models.length < num) {
      num = car.models.length
      brand = car.brand
    }
  });
  return brand;
}
