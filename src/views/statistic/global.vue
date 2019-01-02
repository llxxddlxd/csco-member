<script>
const Committeeid=1;
const key='79ECFB2F3F0C098B'; 
const colorSelect = ['red', 'green','orange','blueviolet','gray','black','blue','purple','yellow','pink'];
  export default
  {
    Committeeid, 
    key,  
    colorSelect,
    operatorData:function(data,totalCount){
    	let tempcount =0;
        let mark =0;
        let mark_bak =0;
        let mark_bak2 =0;
        let member_data=[];
        let member_column=[];
        let member_value=[];
        let member_data_bak=[];
        let member_column_bak=[];
        let member_value_bak=[];
        let member_data_bak2=[];
        let member_column_bak2=[];
        let member_value_bak2=[];
 
        for(var i = 0;i<data.length;i++){
            if((member_column.length+member_column_bak.length+member_column_bak2.length)<8){
                if(data[i].name=='不详' ||data[i].name=='无' ){

                    member_column_bak[mark_bak] = data[i].name;
                    member_value_bak[mark_bak] = data[i].count;
                    var temp ={};
                    temp.value=data[i].count
                    temp.name=data[i].name
                    member_data_bak[mark_bak] = temp;
                    tempcount +=parseInt(data[i].count)
                    mark_bak++
                } 
                else if(data[i].name=='其他'  ){

                    member_column_bak2[mark_bak2] = data[i].name;
                    member_value_bak2[mark_bak2] = data[i].count;
                    var temp ={};
                    temp.value=data[i].count
                    temp.name=data[i].name
                    member_data_bak2[mark_bak2] = temp;
                    mark_bak2++

                    // tempcount +=res.data[i].count  此值仅仅统计的是非其他的
                }
                else{
                    member_column[mark] = data[i].name;
                    member_value[mark] = data[i].count;
                    var temp ={};
                    temp.value=data[i].count
                    temp.name=data[i].name
                    member_data[mark] = temp;
                    tempcount = tempcount + parseInt(data[i].count) 
                    mark++
                }

            }
        } 

        if(member_column_bak2.length>0){
            //已经返回其他了               合并三个数组
            
        }
        else{ 
            //把最后一个替换为其他  合并另外两个数组，最后加上  其他
            member_column_bak2[0] = "其他";
            member_value_bak2[0] = "20";//this.totalMemers - tempcount;
            var temp ={};
            temp.value=member_value_bak2[0]
            temp.name=member_column_bak2[0]
            member_data_bak2[0] = temp;
            //从正常的数组，删除一个
            member_column.pop();
            member_value.pop();
            member_data.pop();

        }  
        console.log(2222222222)
        console.log(member_column)
        member_column = member_column.concat(member_column_bak,member_column_bak2)
        member_value = member_value.concat(member_value_bak,member_value_bak2)

        for(var i =0;i<member_data_bak.length;i++){
            member_data[member_data.length] = member_data_bak[i];
        }
        for(var i =0;i<member_data_bak2.length;i++){
            member_data[member_data.length] = member_data_bak2[i];
        } 
        let ret=[];
        ret['member_column']=member_column;
        ret['member_value']=member_value;
        ret['member_data']=member_data;
        console.log(member_data)

        return ret;

    },
    //数据已经整理完成
    operatorChinaDataForEchart:function(data){
        let tempcount =0;
       
        let member_data=[];
        let member_column=[];
        let member_value=[];
       
        for(var i = 0;i<7;i++){
            member_column[i] = data[i].name;
            member_value[i] = data[i].value;
            var temp ={};
            temp.value=data[i].value
            temp.name=data[i].name
            member_data[i] = temp; 
             
            
        }
        let ret = [];
        ret['member_column']=member_column;
        ret['member_value']=member_value;
        ret['member_data']=member_data;
        console.log(1111111111111111)
        console.log(member_data)

        return ret;

    },
    operatorChinaData:function(){
        let column = ["北京","天津","上海","重庆","河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东省","海南","四川","贵州省","云南","陕西","甘肃","青海","台湾","内蒙古","广西","西藏","宁夏","新疆","香港","澳门"];
        let data = [];
        for (var i =0;i< column.length; i++) {
            var temp = {};
            temp.value = 0;
            temp.name = column[i];
            data[i] = temp;
        }
        return temp;
    }
  }
</script>
