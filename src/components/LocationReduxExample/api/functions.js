export const loadData = async(location) => {
      const url=`http://api.weatherapi.com/v1/current.json?key=934bf32471e548949ae214411222203 &q=${location}&aqi=no`;
      let result, jsonResult;
      try{
        result = await fetch(url);
        if(result?.ok || result?.status === 200) jsonResult =  await result?.json();
        else {  }
      } catch(ex){  }
      return await jsonResult;
    };