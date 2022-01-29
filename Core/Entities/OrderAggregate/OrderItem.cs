namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrderd itemOrderd, decimal price, int quantity)
        {
            this.itemOrderd = itemOrderd;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrderd itemOrderd { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}